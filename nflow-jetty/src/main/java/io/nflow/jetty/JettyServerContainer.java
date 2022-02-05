package io.nflow.jetty;

import static org.springframework.util.ReflectionUtils.findMethod;
import static org.springframework.util.ReflectionUtils.invokeMethod;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Server;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class JettyServerContainer {
  private final Server server;

  public JettyServerContainer(Server server) {
    this.server = server;
  }

  public boolean isStarted() {
    return server.isStarted();
  }

  public void stop() throws Exception {
    server.stop();
  }

  public boolean isStopped() {
    return server.isStopped();
  }

  public void setStopTimeout(int stopTimeout) {
    server.setStopTimeout(stopTimeout);
  }

  public int getPort() {
    return getLocalPort(server.getConnectors()[0]);
  }

  @SuppressFBWarnings(value = "NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE", justification = "npe is unlikely")
  private Integer getLocalPort(Connector connector) {
    return (Integer) invokeMethod(findMethod(connector.getClass(), "getLocalPort"), connector);
  }
}
