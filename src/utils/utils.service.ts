import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
  exclude<T extends object, K extends keyof T>(
    obj: T,
    keys: K[] | K,
  ): Omit<T, K> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => {
        if (Array.isArray(keys)) {
          return !keys.includes(key as K);
        } else {
          return key !== keys;
        }
      }),
    ) as Omit<T, K>;
  }
}
