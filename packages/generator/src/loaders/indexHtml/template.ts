/**
 * index.html模板
 * @param title title
 */
export function indexHtmlTemplateLoader(title: string) {
  return `<!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <style>
    body, #root {
       margin: 0;
       padding: 0;
       position: relative;
       z-index: 0;
     }

    * {
     box-sizing: border-box;
    }
   </style>
   <title>${title}</title>
 </head>
 <body>
   <div id="root"></div>
 </body>
 </html>
`;
}
