import React, { useState } from "react";
import {
  PluginClient,
  usePlugin,
  MasterDetail,
  createDataSource,
  DataTableColumn,
  Dialog,
} from "flipper-plugin";
import { Button, Typography } from "antd";

type Incoming = [string, string][];

type Events = {
  init: { content: Incoming };
  content: { content: Incoming };
};

type Commands = {
  clearStorage: () => Promise<void>;
  contentRequest: () => Promise<void>;
};

type Data = { key: string; value: any };

const parseJSON = (string: string) => {
  try {
    return JSON.parse(string);
  } catch {
    return string;
  }
};

export function plugin(client: PluginClient<Events, Commands>) {
  const data = createDataSource<Data, "key">([], {
    persist: "logs",
    key: "key",
  });

  client.onMessage("content", ({ content }) => {
    data.clear();
    content.forEach(([key, value]) => {
      data.append({ key, value: parseJSON(value) });
    });
  });

  const clearStorage = () => {
    data.clear();
    client.send("clearStorage", undefined);
  };

  const sync = () => {
    client.send("contentRequest", undefined);
  };

  return { data, clearStorage, sync };
}

type Row = {
  key: string;
  value: string;
};

const columns: DataTableColumn<Row>[] = [
  {
    key: "key",
    width: "40%",
    title: "Key",
  },
  {
    key: "value",
    title: "Value",
    width: "60%",
  },
];

export function Component() {
  const instance = usePlugin(plugin);
  const [syncLoading, setSyncLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const syncCallback = () => {
    setSyncLoading(true);
    instance.sync();
    setTimeout(() => {
      setSyncLoading(false);
    }, 1000);
  };

  const clearCallback = async (): Promise<true> => {
    setClearLoading(true);
    instance.clearStorage();
    setTimeout(() => {
      setClearLoading(false);
    }, 1000);
    return true;
  };

  return (
    <MasterDetail
      dataSource={instance.data}
      columns={columns}
      extraActions={
        <>
          <Button onClick={syncCallback} loading={syncLoading}>
            Sync
          </Button>
          <Button
            onClick={() => {
              Dialog.confirm({
                title: "Clear AsyncStorage?",
                message: (
                  <Typography>
                    {"This will call AsyncStorage.clear()"}
                  </Typography>
                ),
                onConfirm: clearCallback,
              });
            }}
            loading={clearLoading}
          >
            Clear
          </Button>
        </>
      }
    />
  );
}
