import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { create as createXml } from "xmlbuilder";

const app = express();
const API_PORT = Number(process.env.API_PORT || 5175);

app.use(cors());
app.use(bodyParser.json());

function buildVoterResponse(id) {
  // Minimal mock implementation that echoes the provided ID
  return {
    Id: String(id),
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
    VoterId: 5,
  };
}

function voterToXml(voter) {
  const root = createXml('Voter', {
    version: '1.0',
    encoding: 'UTF-8'
  });
  root.att('xmlns:i', 'http://www.w3.org/2001/XMLSchema-instance');
  root.att('xmlns', 'http://schemas.datacontract.org/2004/07/IECService.Models');

  root.ele('Id').text(voter.Id);
  root.ele('VoterId').text(String(voter.VoterId));
  root.ele('VoterStatus').text(voter.VoterStatus);
  root.ele('VoterStatusID').text(String(voter.VoterStatusID));
  const votingStation = root.ele('VotingStation');
  const delim = votingStation.ele('Delimitation');
  delim.ele('Municipality').text(voter.VotingStation.Delimitation.Municipality);
  delim.ele('MunicipalityID').text(String(voter.VotingStation.Delimitation.MunicipalityID));
  delim.ele('Province').text(voter.VotingStation.Delimitation.Province);
  delim.ele('ProvinceID').text(String(voter.VotingStation.Delimitation.ProvinceID));
  delim.ele('VDNumber').text(String(voter.VotingStation.Delimitation.VDNumber));
  delim.ele('WardID').text(String(voter.VotingStation.Delimitation.WardID));

  const loc = votingStation.ele('Location');
  loc.ele('Latitude').text(String(voter.VotingStation.Location.Latitude));
  loc.ele('Longitude').text(String(voter.VotingStation.Location.Longitude));
  loc.ele('Municipality').text(voter.VotingStation.Location.Municipality);
  loc.ele('MunicipalityID').text(String(voter.VotingStation.Location.MunicipalityID));
  loc.ele('Province').text(voter.VotingStation.Location.Province);
  loc.ele('ProvinceID').text(String(voter.VotingStation.Location.ProvinceID));
  loc.ele('Street').text(voter.VotingStation.Location.Street);
  loc.ele('Suburb').text(voter.VotingStation.Location.Suburb);
  loc.ele('Town').text(voter.VotingStation.Location.Town);
  loc.ele('VDAddress').text(voter.VotingStation.Location.VDAddress);
  loc.ele('VDNumber').text(String(voter.VotingStation.Location.VDNumber));
  loc.ele('VotingDistrict').text(voter.VotingStation.Location.VotingDistrict);
  loc.ele('WardID').text(String(voter.VotingStation.Location.WardID));
  votingStation.ele('Name').text(voter.VotingStation.Name);
  root.ele('bRegistered').text(String(voter.bRegistered));

  return root.end({ pretty: true });
}

app.get('/api/Voters/VoterStatus/IDNumber/:ID', (req, res) => {
  const id = String(req.params.ID || '').trim();
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  const voter = buildVoterResponse(id);

  const acceptHeader = String(req.headers['accept'] || '').toLowerCase();
  const wantsXml = acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml');

  if (wantsXml) {
    const xml = voterToXml(voter);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xml);
  }

  // Default to JSON (covers application/json and */*)
  res.status(200).json(voter);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${API_PORT}`);
});

