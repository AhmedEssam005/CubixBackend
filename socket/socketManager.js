const activeModes = new Map();

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

      // If another device already has an active mode, send it to the late-joiner
      if (activeModes.has(userId)) {
        socket.emit('mode_started', activeModes.get(userId));
        console.log(`[Socket] Sent existing active mode to late-joiner ${socket.id}`);
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

    socket.on('disconnect', () => {
      console.log(`[Socket] disconnected: ${socket.id} (${socket.data.platform ?? 'unknown'})`);
    });
  });

  return io;
};
