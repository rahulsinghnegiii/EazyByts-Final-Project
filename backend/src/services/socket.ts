import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

export class SocketService {
  private io: Server;

  constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join event room
      socket.on('joinEvent', (eventId: string) => {
        socket.join(`event:${eventId}`);
      });

      // Leave event room
      socket.on('leaveEvent', (eventId: string) => {
        socket.leave(`event:${eventId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Notify about event updates
  public notifyEventUpdate(eventId: string, data: any) {
    this.io.to(`event:${eventId}`).emit('eventUpdated', data);
  }

  // Notify about new registrations
  public notifyNewRegistration(eventId: string, data: any) {
    this.io.to(`event:${eventId}`).emit('newRegistration', data);
  }

  // Notify about registration cancellations
  public notifyCancelledRegistration(eventId: string, data: any) {
    this.io.to(`event:${eventId}`).emit('cancelledRegistration', data);
  }

  // Notify about new comments
  public notifyNewComment(eventId: string, data: any) {
    this.io.to(`event:${eventId}`).emit('newComment', data);
  }

  // Notify about event status changes
  public notifyStatusChange(eventId: string, data: any) {
    this.io.to(`event:${eventId}`).emit('statusChanged', data);
  }
} 