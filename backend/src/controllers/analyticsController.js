const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');

const getAnalytics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      activeUsers,
      totalRoles,
      recentLogins,
      usersByRole,
      recentActivities
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Role.countDocuments(),
      AuditLog.countDocuments({
        action: 'login_success',
        createdAt: { $gte: sevenDaysAgo }
      }),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('actor.userId', 'name email')
    ]);

    const roleDistribution = usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          totalRoles,
          loginsLast7Days: recentLogins
        },
        roleDistribution,
        recentActivities: recentActivities.map(log => ({
          id: log._id,
          action: log.action,
          actor: log.actor.email,
          timestamp: log.createdAt,
          details: log.details
        }))
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

module.exports = { getAnalytics };