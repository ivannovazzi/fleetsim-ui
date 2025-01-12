import { HttpClient } from "./httpClient";
import { WebSocketClient } from "./wsClient";
import {
  ApiResponse,
  StartOptions,
  SimulationStatus,
  VehicleDTO,
  VehicleDirection as Direction,
  Road,
  Position,
  Heatzone,
  RoadNetwork,
  POI,
} from "@/types";

class SimulationService {
  constructor(
    private http: HttpClient,
    private ws: WebSocketClient
  ) {
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.getRoads = this.getRoads.bind(this);
    this.getPois = this.getPois.bind(this);
    this.findNode = this.findNode.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.getHeatzones = this.getHeatzones.bind(this);
    this.makeHeatzones = this.makeHeatzones.bind(this);
    this.connectWebSocket = this.connectWebSocket.bind(this);
    this.disconnect = this.disconnect.bind(this);
    // events
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);    
    this.onVehicle = this.onVehicle.bind(this);
    this.onStatus = this.onStatus.bind(this);
    this.onOptions = this.onOptions.bind(this);
    this.onHeatzones = this.onHeatzones.bind(this);
    this.onDirection = this.onDirection.bind(this);
    this.direction = this.direction.bind(this);    
  }

  connectWebSocket(): void {
    this.ws.connect();
  }

  disconnect(): void {
    this.ws.disconnect();
  }

  onConnect(handler: () => void): void {
    this.ws.on("connect", () => handler());
  }

  onDisconnect(handler: () => void): void {
    this.ws.on("disconnect", () => handler());
  }

  onVehicle(handler: (vehicle: VehicleDTO) => void): void {
    this.ws.on("vehicle", (data) => handler(data as VehicleDTO));
  }

  onStatus(handler: (status: SimulationStatus) => void): void {
    this.ws.on("status", (data) => handler(data as SimulationStatus));
  }

  onOptions(handler: (opts: StartOptions) => void): void {
    this.ws.on("options", (data) => handler(data as StartOptions));
  }
  
  onHeatzones(handler: (heatzones: Heatzone[]) => void): void {
    this.ws.on("heatzones", (data) => handler(data as Heatzone[]));
  }

  onDirection(handler: (direction: Direction) => void): void {
    this.ws.on("direction", (data) => handler(data as Direction));
  } 

  async start(options: StartOptions): Promise<ApiResponse<void>> {
    return this.http.post<StartOptions, void>("/start", options);
  }

  async stop(): Promise<ApiResponse<void>> {
    return this.http.post("/stop");
  }

  async reset(): Promise<ApiResponse<void>> {
    return this.http.post("/reset");
  }

  async direction(ids: string[], position: Position): Promise<ApiResponse<void>> {
    const body = ids.map(id => ({ id, lat: position[1], lng: position[0] }));
    return this.http.post("/direction", body);
  }

  async getStatus(): Promise<ApiResponse<SimulationStatus>> {
    return this.http.get<SimulationStatus>("/status");
  }

  async getNetwork(): Promise<ApiResponse<RoadNetwork>> {
    return this.http.get<RoadNetwork>("/network");
  }

  async getRoads(): Promise<ApiResponse<Road[]>> {
    return this.http.get<Road[]>("/roads");
  }

  async getPois(): Promise<ApiResponse<POI[]>> {
    return this.http.get<POI[]>("/pois");
  }

  async findRoad(position: Position): Promise<ApiResponse<Road>> {
    return this.http.post<Position, Road>("/find-road", position);
  }

  async findNode(position: Position): Promise<ApiResponse<Position>> {
    return this.http.post<Position, Position>("/find-node", position);
  }

  async getOptions(): Promise<ApiResponse<StartOptions>> {
    return this.http.get<StartOptions>("/options");
  }

  async updateOptions(options: StartOptions): Promise<ApiResponse<void>> {
    return this.http.post<StartOptions, void>("/options", options);
  }

  async getDirections(): Promise<ApiResponse<Direction[]>> {
    return this.http.get<Direction[]>("/directions");
  }

  async getHeatzones(): Promise<ApiResponse<Heatzone[]>> {
    return this.http.get<Heatzone[]>("/heatzones");
  }

  async makeHeatzones(): Promise<ApiResponse<void>> {
    return this.http.post("/heatzones");
  }

  async search(query: string): Promise<ApiResponse<unknown>> {
    return this.http.post<{ query: string }>(`/search`, { query });
  }
}

const host = "http://localhost:3000";
const wsHost = "ws://localhost:3000";

// const host = "https://fleetsim-jxx8.onrender.com";
// const wsHost = "wss://fleetsim-jxx8.onrender.com";

export default new SimulationService(new HttpClient(host), new WebSocketClient(wsHost));