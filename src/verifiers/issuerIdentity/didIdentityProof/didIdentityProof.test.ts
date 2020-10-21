import { OpenAttestationDidSignedDidIdentityProof } from "./didIdentityProof";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDidWrongSignature } from "../../../../test/fixtures/v2/documentDidWrongSignature";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentDidMixedTokenRegistry } from "../../../../test/fixtures/v2/documentDidMixedTokenRegistry";

// TODO Temporarily passing in this option, until make the entire option optional in another PR
const options = {
  network: "ropsten",
};

describe("skip", () => {
  it("should return skip message", async () => {
    const message = await OpenAttestationDidSignedDidIdentityProof.skip(undefined as any, undefined as any);
    expect(message).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationDidSignedDidIdentityProof",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Document is not using DID as top level identifier",
        },
        "status": "SKIPPED",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
});

describe("test", () => {
  describe("v2", () => {
    it("should return false for documents not using DID as top level identifier", () => {
      expect(OpenAttestationDidSignedDidIdentityProof.test(documentRopstenValidWithDocumentStore, options)).toBe(false);
    });
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {
      expect(OpenAttestationDidSignedDidIdentityProof.test(documentDidSigned, options)).toBe(true);
    });
    it("should return false for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(OpenAttestationDidSignedDidIdentityProof.test(documentDnsDidSigned, options)).toBe(false);
    });
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should pass for documents using `DID` and did signature is correct", async () => {
      const verificationFragment = await OpenAttestationDidSignedDidIdentityProof.verify(documentDidSigned, options);
      expect(verificationFragment).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
              "status": "VALID",
            },
          ],
          "name": "OpenAttestationDidSignedDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should fail for documents using `DID` and did signature is not correct", async () => {
      const verificationFragment = await OpenAttestationDidSignedDidIdentityProof.verify(
        documentDidWrongSignature,
        options
      );
      expect(verificationFragment).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
              "status": "INVALID",
            },
          ],
          "name": "OpenAttestationDidSignedDidIdentityProof",
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should skip other issuers", async () => {
      const verificationFragment = await OpenAttestationDidSignedDidIdentityProof.verify(
        documentDidMixedTokenRegistry,
        options
      );
      expect(verificationFragment).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
              "status": "VALID",
            },
            Object {
              "status": "SKIPPED",
            },
          ],
          "name": "OpenAttestationDidSignedDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
});