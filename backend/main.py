from flask import Flask, render_template
import requests
import feedparser
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, urlunparse
from textblob import TextBlob

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Use environment variable for the API key
NEWS_API_KEY = os.getenv('NEWS_API_KEY')

# Function to clean up URLs
def clean_url(url):
    parsed_url = urlparse(url)
    return urlunparse(parsed_url._replace(query='', fragment=''))  # Remove query and fragment

# Function to analyze sentiment
def analyze_sentiment(text):
    if text:
        blob = TextBlob(text)
        return blob.sentiment.polarity, blob.sentiment.subjectivity  # Polarity: [-1, 1], Subjectivity: [0, 1]
    return 0, 0  # Default sentiment for empty text

def classify_severity(polarity):
    """Classify the severity based on polarity."""
    if polarity >= 0.5:
        return "High Severity"
    elif 0.1 <= polarity < 0.5:
        return "Moderate Severity"
    else:
        return "Minimum Severity"
    
def is_disaster_article(text):
    """Check if the article text contains information indicative of an actual disaster."""
    disaster_keywords = ["disaster", "flood", "earthquake", "cyclone", "landslide", "hurricane", "wildfire", "tsunami"]
    return any(keyword in text.lower() for keyword in disaster_keywords)

# --------- News API --------- #
def fetch_news_api(api_key):
    query = 'disaster OR flood OR earthquake OR cyclone OR landslide OR wildfire OR tsunami OR hurricane OR tornado OR drought OR volcanic eruption OR heatwave OR mudslide'
    url = f"https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&apiKey={api_key}"

    response = requests.get(url)
    if response.status_code == 200:
        news_data = response.json()
        articles = news_data.get('articles', [])
        results = []
        for article in articles:
            text = article.get('description', '') or article.get('content', '')
            if is_disaster_article(text):  # Filter for actual disaster-related news
                polarity, subjectivity = analyze_sentiment(text)
                severity = classify_severity(polarity) 
                article['sentiment_polarity'] = polarity
                article['sentiment_subjectivity'] = subjectivity
                article['severity'] = severity 
                results.append({
                    "title": article['title'],
                    "url": clean_url(article['url']), 
                    "sentiment_polarity": polarity, 
                    "sentiment_subjectivity": subjectivity,
                    "severity": severity
                })
        return results
    else:
        print(f"Error fetching News API: {response.status_code}")
        return []

# --------- GDACS API --------- #
#   def fetch_gdacs():
    url = "https://www.gdacs.org/xml/feed.aspx?event=all"
    response = requests.get(url)

    if response.status_code == 200:
        # Parse XML response
        root = ET.fromstring(response.content)
        results = []
        for event in root.findall('Event'):
            title = event.find('Title').text
            link = event.find('Link').text
            severity = event.find('Severity').text if event.find('Severity') is not None else "Unknown"
            polarity, subjectivity = analyze_sentiment(title)  
            severity_classification = classify_severity(polarity)

            results.append({
                "title": title,
                "url": link,
                "sentiment_polarity": polarity,
                "sentiment_subjectivity": subjectivity,
                "severity": severity_classification
            })
        return results
    else:
        print(f"Error fetching GDACS: {response.status_code}")
        return []
    
# --------- Google News RSS --------- #
def fetch_google_news_rss():
    rss_url = "https://news.google.com/rss/search?q=disaster&hl=en-IN&gl=IN&ceid=IN:en"
    try:
        feed = feedparser.parse(rss_url)

        results = []
        for entry in feed.entries:
            text = entry.summary or entry.content[0].value
            if is_disaster_article(text):  # Filter for actual disaster-related news
                polarity, subjectivity = analyze_sentiment(text)
                severity = classify_severity(polarity) 
                results.append({
                    "title": entry.title,
                    "url": clean_url(entry.link),
                    "sentiment_polarity": polarity,
                    "sentiment_subjectivity": subjectivity,
                    "severity": severity 
                }) 
        return results
    except Exception as e:
        print(f"Error fetching Google RSS: {e}")
        return []

# --------- ReliefWeb API --------- #
def fetch_reliefweb():
    url = "https://api.reliefweb.int/v1/reports?appname=apidoc&query[value]=disaster"
    response = requests.get(url)
    
    if response.status_code == 200:
        disaster_data = response.json()
        results = []
        for report in disaster_data.get('data', []):
            title = report['fields'].get('title', 'No Title')
            url = clean_url(report['fields'].get('url', 'No URL Available'))  
            polarity, subjectivity = analyze_sentiment(title) 
            severity = classify_severity(polarity)  # Classify severity
            if is_disaster_article(title):  # Filter for actual disaster-related news
                results.append({
                    "title": title,
                    "url": url,
                    "sentiment_polarity": polarity,
                    "sentiment_subjectivity": subjectivity,
                    "severity": severity  
                })
        return results
    else:
        print(f"Error fetching ReliefWeb: {response.status_code}")
        return []

# --------- Scraping NDTV  --------- #
# def scrape_ndtv():
    url = "https://www.ndtv.com/india"
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        results = []
        for item in soup.find_all('h2', class_='newsHdng'):
            link = item.find('a')
            text = item.text.strip()
            if link and is_disaster_article(text): 
                polarity, subjectivity = analyze_sentiment(text)
                severity = classify_severity(polarity)  # Classify severity
                results.append({
                    "title": text,
                    "url": clean_url(link['href']),
                    "sentiment_polarity": polarity,
                    "sentiment_subjectivity": subjectivity,
                    "severity": severity 
                })
        return results
    except Exception as e:
        print(f"Error scraping NDTV: {e}")
        return []

# --------- Route to Fetch All Disaster News --------- #
@app.route('/disaster-news', methods=['GET'])
def get_disaster_news():
    # Fetch data from all sources
    news_api_data = fetch_news_api(NEWS_API_KEY)
    google_news_data = fetch_google_news_rss()
    reliefweb_data = fetch_reliefweb()
    ndtv_data = scrape_ndtv()
    # gdacs_data = fetch_gdacs()

    # Combine all data into a single list
    all_news = {
        "News API": news_api_data,
        "Google News": google_news_data,
        # "GDACS": gdacs_data,
        "ReliefWeb": reliefweb_data,
        # "NDTV": ndtv_data

    }

    return render_template('news.html', all_news=all_news)

# --------- Run the Flask App --------- #
if __name__ == '__main__':
    app.run(debug=True)
