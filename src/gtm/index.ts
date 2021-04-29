export const googleTagManager = (id: string, name: string | null) => {
  if (window.dataLayer) return;
  window.dataLayer = [
    {
      wallet: {
        id: id,
        name: name
      }
    }
  ];
  init(window, document, "script", "dataLayer", "GTM-TCBKR7W");
  sendGTMPath(window.location.pathname);
};

const init = (w: any, d: any, s: any, l: any, i: any) => {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
  f.parentNode.insertBefore(j, f);
};

const sendGTM = (data: {}) => {
  const dataLayer = window.dataLayer as {}[];
  if (dataLayer) dataLayer.push(data);
};

export const sendGTMEvent = (event: string, event_properties: {} = {}) =>
  sendGTM({
    event: "CE " + event,
    event_properties: event_properties
  });

export const sendGTMPath = (path: string) =>
  sendGTM({
    event: "VP " + path,
    page: {
      path
    }
  });
