const activeModes = new Map();
// Tracks which platform currently owns the BLE connection per user
// Value: 'mobile' | 'desktop' | null
const bleOwners = new Map();

module.exports = function initSocket(httpServer) {
  const { Server } = require('socket.io');

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] connected: ${socket.id}`);

    socket.on('join', ({ userId, platform }) => {
      if (!userId) return;

      socket.join(`user:${userId}`);
      socket.data.userId = userId;
      socket.data.platform = platform;

      console.log(`[Socket] ${platform} (${socket.id}) joined room user:${userId}`);

      // Send existing active mode to late-joiner
      if (activeModes.has(userId)) {
        socket.emit('mode_started', activeModes.get(userId));
        console.log(`[Socket] Sent existing active mode to late-joiner ${socket.id}`);
      }

      if (bleOwners.has(userId)) {
        socket.emit('ble_status_changed', { owner: bleOwners.get(userId) });
        console.log(`[Socket] Sent existing BLE owner to late-joiner: ${bleOwners.get(userId)}`);
      }
    });

    socket.on('start_mode', (payload) => {
      const { userId, cubeFace, modeName, platform } = payload;
      if (!userId || !modeName) return;

      const event = {
        cubeFace: cubeFace ?? null,
        modeName,
        startedBy: platform,       // 'mobile' | 'desktop'
        startedAt: Date.now(),
      };

      activeModes.set(userId, event);

      console.log(`[Socket] ${platform} started mode "${modeName}" for user ${userId}`);

      socket.to(`user:${userId}`).emit('mode_started', event);
    });

    socket.on('stop_mode', ({ userId, platform }) => {
      if (!userId) return;
      activeModes.delete(userId);
      console.log(`[Socket] ${platform} stopped mode for user ${userId}`);
      socket.to(`user:${userId}`).emit('mode_stopped', { stoppedBy: platform });
    });

    socket.on('task_started', (payload) => {
      const { userId, taskId, taskName, modeName, endTime, platform } = payload;
      if (!userId) return;

      console.log(`[Socket] ${platform} started task "${taskName}" (${modeName}) for user ${userId}`);
      socket.to(`user:${userId}`).emit('task_started', {
        taskId,
        taskName,
        modeName,
        endTime,
        startedBy: platform,
      });
    });

    socket.on('ble_status', ({ userId, owner }) => {
      if (!userId) return;

      if (owner) {
        bleOwners.set(userId, owner);
      } else {
        bleOwners.delete(userId);
      }

      console.log(`[Socket] BLE ownership for user ${userId}: ${owner ?? 'none'}`);
      // Relay to ALL other sockets in the same room (including other tabs of same platform)
      socket.to(`user:${userId}`).emit('ble_status_changed', { owner: owner ?? null });
    });

    socket.on('task_face_locked', ({ userId, platform, modeName }) => {
      if (!userId) return;
      console.log(`[Socket] ${platform} locked task face to "${modeName}" for user ${userId}`);
      socket.to(`user:${userId}`).emit('task_face_locked', { lockedBy: platform, modeName });
    });

    socket.on('task_face_unlocked', ({ userId, platform }) => {
      if (!userId) return;
      console.log(`[Socket] ${platform} unlocked task face for user ${userId}`);
      socket.to(`user:${userId}`).emit('task_face_unlocked', { unlockedBy: platform });
    });

    socket.on('session_paused', ({ userId, platform, modeName }) => {
      if (!userId) return;
      console.log(`[Socket] ${platform} paused session for user ${userId}`);
      socket.to(`user:${userId}`).emit('session_paused', { pausedBy: platform, modeName });
    });

    socket.on('session_resumed', ({ userId, platform }) => {
      if (!userId) return;
      console.log(`[Socket] ${platform} resumed session for user ${userId}`);
      socket.to(`user:${userId}`).emit('session_resumed', { resumedBy: platform });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] disconnected: ${socket.id} (${socket.data.platform ?? 'unknown'})`);

      // If the disconnecting socket was the BLE owner, release ownership
      const userId = socket.data.userId;
      const platform = socket.data.platform;
      if (userId && platform && bleOwners.get(userId) === platform) {
        bleOwners.delete(userId);
        socket.to(`user:${userId}`).emit('ble_status_changed', { owner: null });
        console.log(`[Socket] Released BLE ownership for user ${userId} (${platform} disconnected)`);
      }
    });
  });

  return io;
};
