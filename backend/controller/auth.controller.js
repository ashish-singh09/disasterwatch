const User = require("../Model/User");
const connectDB = require('../DB/db');

const emailValidator = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};


// Create a user in the database
module.exports.signIn = async (req, res) => {
    
    try {
        let { email, provider, name } = req.body;

        provider = String(provider).toLowerCase();
        email = String(email).toLowerCase() ?? '';
        name = name ? String(name).trim() : "Guest";

        // Connect to the database
        await connectDB();

        let user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email ?? "no-email@disaster.com"
            });
        }

        user = await User.create({
            name,
            provider,
            profileImage: `https://api.dicebear.com/5.x/thumbs/png?shapeColor=FD8A8A,F1F7B5,82AAE3,9EA1D4,A084CA,EBC7E8,A7D2CB,F07DEA,EC7272,FFDBA4,59CE8F,ABC270,FF74B1,31C6D4&backgroundColor=554994,594545,495579,395144,3F3B6C,2B3A55,404258,344D67&translateY=5&&seed=${Date.now()}&scale=110&eyesColor=000000,ffffff&faceOffsetY=0`,
            email,
        });

        if (!user) {
            return res.status(500).json({ message: "Error creating user" });
        }

        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email ?? "no-email@ming.chat",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getProfile = async (req, res) => {
    try {

        const { userId, email, provider } = req.body;
        if (!userId && (!email || !provider)) {
            return res.status(400).json({ message: 'User Id or email is required' });
        }

        let searchQuery = {};
        if (userId) {
            searchQuery = { _id: userId };
        } else {
            searchQuery = { email, provider };
        }

        await connectDB();
        const user = await User.findOne(searchQuery).select('_id name profileImage role');

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}