import { createCn } from "cn/config"

// Our type tokens (globals.css @theme) are font sizes. Without this the class merger reads
// `text-body` as a colour and drops the real text colour when both are present.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1", "h2", "h3", "h4", "body", "caption"] }],
    },
  },
})
