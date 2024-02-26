import { expect, test } from "bun:test"
import { add } from "./add"

test("adding", () => {
  expect(add(2, 2)).toBe(4)
  expect(add(2, -2)).toBe(0)
})
