const fs = require('fs');

const path = 'd:\\ETHNICAA\\ethnicaa-site\\src\\app\\product\\[slug]\\ProductClient.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add the import
content = content.replace(
  'import { useEffect, useState } from "react";',
  'import { useEffect, useState } from "react";\nimport styles from "./ProductClient.module.css";'
);

// Replace style={styles.xyz} with className={styles.xyz}
content = content.replace(/style=\{styles\.([a-zA-Z0-9]+)\}/g, 'className={styles.$1}');

// Remove the const styles = { ... } object at the bottom.
// We can use a regex to match from "const styles = {" all the way to the end of the file.
const styleIndex = content.lastIndexOf('const styles = {');
if (styleIndex !== -1) {
    // Keep everything before the const styles block
    content = content.substring(0, styleIndex);
    // remove the trailing "/* ============================================================ STYLES..." 
    const commentIndex = content.lastIndexOf('/* ============================================================');
    if (commentIndex !== -1 && commentIndex > content.lastIndexOf('export default function')) {
        content = content.substring(0, commentIndex);
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated ProductClient.jsx!');
