export const sendGTMEvent = (e: any) => {
  let data: any = {};
  if (e["dataLayer"]) data = e["dataLayer"];

  if (e["event"]) data["event"] = e["event"];

  data["event_properties"] = e["event_properties"] ? e["event_properties"] : {};
  data["user_properties"] = e["user_properties"] ? e["user_properties"] : {};
  data["ga_event"] = e["ga_event"];

  const dataLayer = window.dataLayer as {}[];
  dataLayer.push(data);
};
