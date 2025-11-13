const User = require('../models/User');
const Message = require('../models/Message');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get current month start date
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total users
    const totalUsers = await User.countDocuments();

    // Admin count
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    // New registrations this month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthStart }
    });

    // Unread messages count
    const unreadMessages = await Message.countDocuments({ isRead: false });

    // Recent activity (last 10 users)
    const recentUsers = await User.find()
      .select('name createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentActivity = recentUsers.map(user => ({
      user: user.name,
      action: user.lastLogin 
        ? (new Date(user.lastLogin).getTime() > new Date(user.createdAt).getTime() + 60000 
            ? 'লগইন করেছেন' 
            : 'নতুন রেজিস্ট্রেশন')
        : 'নতুন রেজিস্ট্রেশন',
      time: user.lastLogin || user.createdAt,
      type: user.lastLogin ? 'success' : 'info'
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        adminCount,
        unreadMessages,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
