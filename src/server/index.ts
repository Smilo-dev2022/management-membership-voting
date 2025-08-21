import express, { Request, Response } from "express";
import cors from "cors";

// Simple in-memory implementation of GET api/v1/Voters/GetVoterExt
// Supports JSON (default) and XML based on Accept header

const app = express();
app.use(cors());

function buildSampleResponse(id: string) {
  return {
    Id: id,
    VoterStatus: "sample string 2",
    VoterStatusID: 3,
    bRegistered: true,
    VotingStation: {
      Name: "sample string 1",
      Delimitation: {
        ProvinceID: 1,
        Province: "sample string 2",
        MunicipalityID: 3,
        Municipality: "sample string 4",
        WardID: 5,
        VDNumber: 6,
      },
      Location: {
        Town: "sample string 1",
        Suburb: "sample string 2",
        Street: "sample string 3",
        Latitude: 4.1,
        Longitude: 5.1,
        ProvinceID: 6,
        Province: "sample string 7",
        MunicipalityID: 8,
        Municipality: "sample string 9",
        WardID: 10,
        VDNumber: 11,
        VotingDistrict: "sample string 12",
        VDAddress: "sample string 13",
      },
    },
    bVDPortionLost: true,
    bSendAddressMsg: true,
  };
}

function toXml(v: any): string {
  // Minimal XML serializer for the given structure
  const esc = (s: any) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const delim = v.VotingStation.Delimitation;
  const loc = v.VotingStation.Location;
  return (
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<VoterExt xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/IECService.Models">` +
    `<Id>${esc(v.Id)}</Id>` +
    `<VoterStatus>${esc(v.VoterStatus)}</VoterStatus>` +
    `<VoterStatusID>${v.VoterStatusID}</VoterStatusID>` +
    `<VotingStation>` +
    `<Delimitation>` +
    `<Municipality>${esc(delim.Municipality)}</Municipality>` +
    `<MunicipalityID>${delim.MunicipalityID}</MunicipalityID>` +
    `<Province>${esc(delim.Province)}</Province>` +
    `<ProvinceID>${delim.ProvinceID}</ProvinceID>` +
    `<VDNumber>${delim.VDNumber}</VDNumber>` +
    `<WardID>${delim.WardID}</WardID>` +
    `</Delimitation>` +
    `<Location>` +
    `<Latitude>${loc.Latitude}</Latitude>` +
    `<Longitude>${loc.Longitude}</Longitude>` +
    `<Municipality>${esc(loc.Municipality)}</Municipality>` +
    `<MunicipalityID>${loc.MunicipalityID}</MunicipalityID>` +
    `<Province>${esc(loc.Province)}</Province>` +
    `<ProvinceID>${loc.ProvinceID}</ProvinceID>` +
    `<Street>${esc(loc.Street)}</Street>` +
    `<Suburb>${esc(loc.Suburb)}</Suburb>` +
    `<Town>${esc(loc.Town)}</Town>` +
    `<VDAddress>${esc(loc.VDAddress)}</VDAddress>` +
    `<VDNumber>${loc.VDNumber}</VDNumber>` +
    `<VotingDistrict>${esc(loc.VotingDistrict)}</VotingDistrict>` +
    `<WardID>${loc.WardID}</WardID>` +
    `</Location>` +
    `<Name>${esc(v.VotingStation.Name)}</Name>` +
    `</VotingStation>` +
    `<bRegistered>${v.bRegistered}</bRegistered>` +
    `<bSendAddressMsg>${v.bSendAddressMsg}</bSendAddressMsg>` +
    `<bVDPortionLost>${v.bVDPortionLost}</bVDPortionLost>` +
    `</VoterExt>`
  );
}

app.get("/api/v1/Voters/GetVoterExt", (req: Request, res: Response) => {
  const id = String(req.query.ID || "").trim();
  if (!id) {
    return res.status(400).json({ message: "Missing required query parameter 'ID'" });
  }

  const payload = buildSampleResponse(id);

  const accept = String(req.headers["accept"] || "application/json");
  if (accept.includes("application/xml") || accept.includes("text/xml")) {
    const xml = toXml(payload);
    res.set("Content-Type", "application/xml; charset=utf-8").status(200).send(xml);
    return;
  }

  res.status(200).json(payload);
});

const PORT = Number(process.env.PORT || 5174);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});

