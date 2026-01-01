export abstract class ApiService {
  private readonly EBM_BASE_URL = process.env.EBM_BASE_URL ||  "http://localhost:4000";
  private headers: any;

  constructor(headers: any) {
    this.headers = headers;
  }

   async fetch<T>(endpoint: string, method: string = "GET", body?: any,): Promise<T> {
    const response = await fetch(`${this.EBM_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(this.headers)
      },
      body: JSON.stringify(body)
    }
    );

    const result = await response.json();
    
    if (!response.ok) {
      if(response.status === 401) {
        throw ("Unauthorized, Please check your credentials");
      }
      if(response.status === 404){
        throw (`Not Found, Please check your endpoint ${ this.EBM_BASE_URL}/${endpoint}`);
      }
      if(response.status === 500){
        throw result;
      }
      // if(response.status === 400){
      //   throw ("Bad Request, Please check your request");
      // }
      throw response;
    }
    return result;
  }
}