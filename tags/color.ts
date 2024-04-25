let assEscape = s => s.replace(/[{}\|]/g, m=>`\\${m}`);

let ass = {
    program: (instructions) => {
        return instructions.join("")
    },
    js: (instructions) => {
        return `{js:${instructions.join(";")}}`
    },
    tag: (tagName, args) => {
        return  `{tag:${assEscape(tagName)}|${args.map(arg => assEscape(arg)).join('|')}}`
    }, ignore: (fn) => {
        return `{ignore:(${fn.toString()})()}`
    }
}
declare var chromatism: any;
declare var args: string[];
declare var message: any;
let res = ass.program([
    ass.js([
        "let chromatism = " + ass.tag("require", ["https://unpkg.com/chromatism@3.0.0/dist/chromatism.cjs.js"]),
        ass.ignore(async () => {
            chromatism = await chromatism
            let imported = await fetch('https://gist.githubusercontent.com/fres621/246a9ad1dc69ebcaf593b4cfe752e6a4/raw/pureimage.js').then(e=>e.text())
            let { UPNG } = (new Function(imported))();
            let buf = await fetch(args[0]).then(e=>e.arrayBuffer());
            var imageData = UPNG.decode(buf);
            var [ image ] = UPNG.toRGBA8(imageData);
          
            var modified = new Uint8Array(image);
            for (let i = 0; i < modified.length; i += 4) {
              let [r, g, b] = modified.slice(i, i + 3);
              let out = chromatism.hue(parseInt(args[1]), { r, g, b }).rgb
              modified.set([out.r, out.g, out.b], i);
            }
          
            var png = UPNG.encode([ modified.buffer ], imageData.width, imageData.height);
            
            return new Uint8Array(png);
        })
    ])
])

console.log(res)