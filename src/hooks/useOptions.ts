import { ClientDataContext } from "@/context";
import { StartOptions } from "@/types";
import client from "@/utils/client";
import { useRef } from "react";
import { useContext, useEffect } from "react";

export function useOptions(timeout: number) {
  const { options, setOptions } = useContext(ClientDataContext);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    client.getOptions().then((optionsData) => {
      setOptions(optionsData.data);
    });
    client.onOptions((options) => {
      setOptions(options);
    });
  }, [setOptions]);

  const updateOption = <T extends keyof StartOptions>(
    field: T,
    value: StartOptions[T]
  ) => {
    clearTimeout(timer.current);
    setOptions((options) => {
      const newOptions = { ...options, [field]: value };
      timer.current = setTimeout(async () => {
        await client.updateOptions(newOptions);
      }, timeout);
      return newOptions;
    });
  };

  return { options, updateOption };
}