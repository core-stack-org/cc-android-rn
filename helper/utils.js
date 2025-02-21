import syncStorage from "sync-storage";
import React, { useState, useEffect } from "react";
import { app_name, base_url } from "./constants";

exports.getWebviewUrl = (screen) => {
  if (!screen) {
    return null;
  }

  const baseUrl = base_url; 

  const web_uri = `${baseUrl}/${screen}` +
    "?geoserver_url=" + syncStorage.get("geoserver_url") +
    "&app_name=" + app_name +
    "&dist_name=" + syncStorage.get("dist_name") +
    "&block_name=" + syncStorage.get("block_name") +
    "&block_id=" + syncStorage.get("block_id");

  console.log("Storage values:", {
    geoserver_url: syncStorage.get("geoserver_url"),
    dist_name: syncStorage.get("dist_name"),
    block_name: syncStorage.get("block_name"),
    block_id: syncStorage.get("block_id"),
  });
  console.log("WEB URI:", web_uri);
  return web_uri;
};

exports.getQueryParams = (block_obj, dist_obj) => {
  block_pkey =
    dist_obj.label +
    "-" +
    dist_obj.value +
    "-" +
    block_obj.label +
    "-" +
    block_obj.value;
  return block_pkey;
};