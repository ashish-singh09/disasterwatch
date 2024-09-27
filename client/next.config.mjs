/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                pathname: '**',
            }
        ]
    },
};

export default nextConfig;
