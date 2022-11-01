import Imap from "imap";
import { simpleParser } from "mailparser";

class email {
  protected imapConfig: any = {
    user: "aliqulovazizjon79@gmail.com",
    password: "ytswsduyuhwfowte",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  };
  constructor() {
    console.log(this.imapConfig);
  }

  async getEmail() {
    const imap = new Imap(this.imapConfig);
    imap.openBox("INBOX", false, () => {
      imap.search(["UNSEEN", ["SINCE", new Date()]], (err, results) => {
        const f = imap.fetch(results, { bodies: "" });
        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (parsed) => {
              console.log(parsed);
            });
          });
          msg.on("attributes", (attrs: any) => {
            const { uuid } = attrs;
            imap.addFlags(uuid, ["\\Seen"], () => {
              console.log("Marked as read!");
            });
          });
        });

        f.once("error", (ex) => {
          return Promise.reject(ex);
        });
        f.once("end", () => {
          console.log("Done fetching all messages!");
          imap.end();
        });
      });
    });

    imap.once("error", (err: any) => {
      console.log(err);
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  }
}

new email().getEmail();
