const fs = require("fs");
const path = require("path");
const replacements = {
  "bg-[#faeeda]": "bg-[#faeeda]/10",
  "text-[#854f0b]": "text-[#ef9f27]",
  "border-[#ef9f27]": "border-[#ef9f27]/30",
  "bg-[#e6f1fb]": "bg-[#85b7eb]/10",
  "text-[#185fa5]": "text-[#85b7eb]",
  "border-[#85b7eb]": "border-[#85b7eb]/30",
  "bg-[#eaf3de]": "bg-[#97c459]/10",
  "text-[#3b6d11]": "text-[#97c459]",
  "border-[#97c459]": "border-[#97c459]/30",
  "bg-[#fcebeb]": "bg-[#f09595]/10",
  "text-[#a32d2d]": "text-[#f09595]",
  "border-[#f09595]": "border-[#f09595]/30",
  "bg-[#ef9f27]": "bg-[#ef9f27]",
  "bg-[#378add]": "bg-[#378add]",
  "bg-[#639922]": "bg-[#639922]",
  "bg-[#e24b4a]": "bg-[#e24b4a]"
};
function go(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) go(p);
    else if (p.endsWith(".jsx")) {
      let c = fs.readFileSync(p, "utf8");
      for (const [k, v] of Object.entries(replacements)) {
        c = c.split(k).join(v);
      }
      fs.writeFileSync(p, c);
    }
  }
}
go("src/features/dashboard/ownerDashboard/components/collaborations/singleCollab");

