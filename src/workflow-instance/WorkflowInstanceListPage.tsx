import React, { useContext, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import WorkflowInstanceSearchForm from "./WorkflowInstanceSearchForm";
import { ConfigContext } from "../config";
import { Spinner } from "../component";
import { formatAgo } from "../utils";
import { listWorkflowDefinitions, listWorkflowInstances } from "../service";
import { WorkflowInstance } from "../types";

function WorkflowInstanceListPage() {
  const config = useContext(ConfigContext);

  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [definitions, setDefinitions] = useState<Array<any>>([]);
  const [instances, setInstances] = useState<Array<WorkflowInstance>>([]);
  // TODO if query parameters are given this should do an immediate query

  // TODO use this from a service, cache it here
  const fetchDefinitions = useCallback(() => {
    listWorkflowDefinitions(config)
      .then((data) => setDefinitions(data))
      .catch((error) => {
        // TODO error handling
        console.error("Error", error);
      })
      .finally(() => setInitialLoad(false));
  }, []);

  useEffect(() => fetchDefinitions(), []);

  const searchInstances = useCallback((data: any) => {
    listWorkflowInstances(config, data)
      .then((data) => setInstances(data))
      .catch((error) => {
        // TODO error handling
        console.error("Error", error);
      });
  }, []);

  const instanceRow = (instance: any) => {
    // TODO color
    const path = "/workflow/" + instance.id;
    return (
      <tr key={instance.id}>
        <td>
          <Link to={path}>{instance.id}</Link>
        </td>
        <td>
          <Link to={path}>{instance.type}</Link>
        </td>
        <td>{instance.state}</td>
        <td>{instance.stateText}</td>
        <td>{instance.status}</td>
        <td>{instance.businessKey}</td>
        <td>{instance.externalId}</td>
        <td>{instance.retries}</td>
        <td title={formatAgo(instance.created)}>{instance.created}</td>
        <td title={formatAgo(instance.started)}>{instance.started}</td>
        <td title={formatAgo(instance.modified)}>{instance.modified}</td>
        <td title={formatAgo(instance.nextActivation)}>
          {instance.nextActivation}
        </td>
      </tr>
    );
  };

  const instanceTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Workflow type</td>
            <td>State</td>
            <td>State text</td>
            <td>Status</td>
            <td>Business key</td>
            <td>External id</td>
            <td>Retries</td>
            <td>Created</td>
            <td>Started</td>
            <td>Modified</td>
            <td>Next activation</td>
          </tr>
        </thead>
        <tbody>{instances.map(instanceRow)}</tbody>
      </table>
    );
  };

  // TODO fetch the list of all definitions
  const search = (data: any) => {
    console.log("searching", data);
    searchInstances(data);
  };

  return (
    <div>
      <h1>Workflow instance list</h1>
      {initialLoad ? (
        <Spinner />
      ) : (
        <WorkflowInstanceSearchForm
          definitions={definitions}
          onSubmit={search}
        />
      )}
      {instanceTable()}
    </div>
  );
}

export default WorkflowInstanceListPage;
