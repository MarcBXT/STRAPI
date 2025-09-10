const checkErrorsAnalysis = (line, i) => {
  let checkCNS = true;
  if (line.CNSActs !== undefined) {
    for (const cns of line.CNSActs) {
      if (cns.Code === undefined) {
        checkCNS = false;
      }
    }
  }

  let checkCond = true;
  if (line.Conditions !== undefined) {
    for (const cond of line.Conditions) {
      if (
        cond.Code === undefined ||
        cond.Name === undefined ||
        cond.CodeSystem === undefined ||
        cond.AddOriginalText === undefined
      ) {
        checkCond = false;
      }
    }
  }

  let checkSite = true;
  if (line.TargetSites !== undefined) {
    for (const site of line.TargetSites) {
      if (
        site.Code === undefined ||
        site.Name === undefined ||
        site.CodeSystem === undefined ||
        site.AddOriginalText === undefined
      ) {
        checkSite = false;
      }
    }
  }

  if (
    line.Code === undefined ||
    line.Name === undefined ||
    line.Specimen === undefined ||
    !checkCNS ||
    !checkCond ||
    !checkSite
  ) {
    const errors = {
      line: i,
      Code: line.Code === undefined ? "undefined" : "OK",
      Name: line.Name === undefined ? "undefined" : "OK",
      Specimen: line.Specimen === undefined ? "undefined" : "OK",
      CNSActs: !checkCNS ? "undefined (CNSActs missing or Code missing)" : "OK",
      Conditions: !checkCond
        ? "undefined (Conditions missing or Code, Name, CodeSystem, AddOriginalText missing)"
        : "OK",
      TargetSites: !checkSite
        ? "undefined (TargetSites missing or Code, Name, CodeSystem, AddOriginalText missing)"
        : "OK",
    };
    return errors;
  } else {
    return null;
  }
};

const checkStructureAnalysis = async (json) => {
  const errors = [];
  let i = 1;

  // check structure of data of analysis
  for (const line of json) {
    const error = checkErrorsAnalysis(line, i);
    if (error !== null) {
      errors.push(error);
    }

    i++;
  }

  return errors;
};

module.exports = {
  checkStructureAnalysis,
};
