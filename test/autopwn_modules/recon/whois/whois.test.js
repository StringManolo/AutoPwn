import lookup from "../../../../autopwn_modules/recon/whois/whois.js";

console.log("Module loaded.");

(async () => {
  try {
    const domain = "example.com";
    const result = await lookup(domain);
    console.log("Printing result...");
    console.log(result);
    console.log("Result printed sucessfully");
  } catch (err) {
    console.log("Unhandled error found:");
    console.error(err);
  }
})();

