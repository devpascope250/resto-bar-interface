import { io, Socket } from 'socket.io-client';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }


  public initialize(): void {
    if (this.socket?.connected) return;
    this.socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });
  }

  public onWhenConnected(event: string, callback: (data: any) => void, waitForConnection: boolean = true): void {
  if (this.socket?.connected || !waitForConnection) {
    this.socket?.on(event, callback);
  } else {
    this.socket?.once('connect', () => {
      this.socket?.on(event, callback);
    });
  }
}



  // Join rooms with type safety
  public joinRoom(roomId: string): void {
    this.socket?.emit('ebm:joinRoom', roomId);
  }

  public ebmJoinRoom(roomId: string): void {
    this.socket?.emit('ebm:ebmMessage', roomId);
  }

  // Track deliveries
  public trackDelivery(deliveryId: string): void {
    this.socket?.emit('ebm:trackDelivery', deliveryId);
  }

  // Generic event listener
  public on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  // Remove listener
  public off(event: string, waitForConnection?: () => void): void {
    this.socket?.off(event);
  }

  // Disconnect socket
  public disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  // Reconnect with new token if needed
  public updateToken(newToken: string): void {
    if (this.socket) {
      this.socket.auth = { token: newToken };
      if (!this.socket.connected) {
        this.socket.connect();
      }
    } else {
      this.initialize();
    }
  }
}

const socketService = SocketService.getInstance();
export {socketService};