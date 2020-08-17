export interface GeckoboardInstance {
    VERSION: string;
    ping: (callback: Function) => unknown;
    datasets: {
        findOrCreate: (datasetMeta: DatasetMeta, cb: Function) => void;
        delete: (id: string, cb: Function) => void;
    };
}

export interface DatasetMeta {
    id: string;
    fields: {
        [key: string]: {
            name: string;
            optional?: boolean;
        } & (
            | {
                  type: "date" | "datetime" | "number" | "percentage" | "string";
              }
            | {
                  type: "money";
                  currency_code: string;
              }
        );
    };
}

export type GeckoboardResponse =
    | {
          success: true;
      }
    | {
          success: false;
          content: string;
      };

export interface DatasetInstance {
    put: (body: Array<{ [key: string]: string | number }>, cb: Function) => void;
    post: (body: Array<{ [key: string]: string | number }>, options: { delete_by?: string }, cb: Function) => void;
}

export interface DatasetInstanceAsync {
    set: (body: Array<{ [key: string]: string | number }>) => Promise<GeckoboardResponse>;
    add: (
        body: Array<{ [key: string]: string | number }>,
        options?: { delete_by?: string },
    ) => Promise<GeckoboardResponse>;
}

export type GeckoboardResponseDataset =
    | {
          success: true;
          dataset: DatasetInstanceAsync;
      }
    | {
          success: false;
          content: string;
      };

export interface GeckoboardInstanceAsync {
    VERSION: string;
    ping: () => Promise<GeckoboardResponse>;
    datasets: {
        findOrCreate: (datasetMeta: DatasetMeta) => Promise<GeckoboardResponseDataset>;
        delete: (id: string, cb: Function) => Promise<GeckoboardResponse>;
    };
}
