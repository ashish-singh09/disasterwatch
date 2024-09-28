from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import feedparser
#from flask_cors import CORS  # Import CORS

# Create the Flask app
app = Flask(__name__)

# Enable CORS for all routes
#CORS(app)

# Load environment variables from .env file (if needed)
load_dotenv()

# Severity classification based on keywords
HIGH_SEVERITY_KEYWORDS = ['earthquake', 'fatal', 'evacuate', 'flood', 'explosion', 'massive', 'deadly', 'collapse']
MEDIUM_SEVERITY_KEYWORDS = ['damage', 'fire', 'landslide', 'storm', 'disruption', 'destroy', 'rescue']

def clean_url(url):
    # Function to clean up URLs
    url = url.replace("http://", "").replace("https://", "").replace("www.", "").split('/')[0]
    return url

def analyze_severity(text):
    """
    Function to analyze the severity of a disaster news title or description.
    The severity is classified into:
    - 'High' if keywords indicating high severity are found.
    - 'Medium' if keywords indicating medium severity are found.
    - 'Low' if neither high nor medium severity keywords are found.
    """
    text = text.lower()  # Convert text to lowercase for easier keyword matching

    # Check for high severity keywords
    if any(keyword in text for keyword in HIGH_SEVERITY_KEYWORDS):
        return 'High'
    
    # Check for medium severity keywords
    elif any(keyword in text for keyword in MEDIUM_SEVERITY_KEYWORDS):
        return 'Medium'
    
    # If no keywords match, classify as low severity
    else:
        return 'Low'

# Example: Fetch news from a specific news API (can be modified as per your data sources)
def fetch_news_api():
    api_key = os.getenv('NEWS_API_KEY')  # Load API key from .env
    url = f"https://newsapi.org/v2/everything?q=disaster&apiKey={api_key}"
    response = requests.get(url)
    news_data = response.json().get('articles', [])
    
    news_list = []
    for article in news_data:
        news_item = {
            "title": article['title'],
            "source": clean_url(article['url']),
            "url": article['url'],
            "severity": analyze_severity(article['title'])  # Analyzing severity instead of sentiment
        }
        news_list.append(news_item)
    return news_list

# Example: Fetch Google News RSS feed (can add more sources here)
def fetch_google_news_rss():
    feed_url = "https://news.google.com/rss/search?q=disaster"
    feed = feedparser.parse(feed_url)
    
    news_list = []
    for entry in feed.entries:
        news_item = {
            "title": entry.title,
            "source": clean_url(entry.link),
            "url": entry.link,
            "severity": analyze_severity(entry.title)  # Analyzing severity instead of sentiment
        }
        news_list.append(news_item)
    return news_list

# Example: Scrape disaster news from NDTV
def scrape_ndtv():
    url = "https://www.ndtv.com/topic/disaster"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    news_list = []
    articles = soup.find_all('div', class_='news_Itm-cont')
    
    for article in articles:
        title = article.find('a').get_text()
        link = article.find('a')['href']
        news_item = {
            "title": title,
            "source": clean_url(link),
            "url": link,
            "severity": analyze_severity(title)  # Analyzing severity instead of sentiment
        }
        news_list.append(news_item)
    return news_list

# API Endpoint to serve disaster news as JSON
@app.route('/api/disaster-news', methods=['GET'])
def disaster_news():
    """
    API endpoint to return disaster news with severity classification as JSON data.
    - Gathers news from multiple sources (news API, Google RSS, and NDTV).
    - Analyzes the severity of each news title (high, medium, low).
    """
    all_news = []

    # Fetch news from various sources
    all_news.extend(fetch_news_api())
    all_news.extend(fetch_google_news_rss())
    all_news.extend(scrape_ndtv())

    # Return the results as JSON
    return jsonify(all_news)

if __name__ == '__main__':
    # Run the Flask app on localhost:5000
    app.run(debug=True)
