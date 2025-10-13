import { Hono } from "hono";
import type { Config } from "../../../../config/schema";

interface WateringRouteDeps {
  config: Config

}

export const make = (deps: WateringRouteDeps) => {
  const { config } = deps;
  const app = new Hono()

  app.post(`/watering-now`, (c) => {

  })


}
