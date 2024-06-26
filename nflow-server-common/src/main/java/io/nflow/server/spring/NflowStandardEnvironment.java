package io.nflow.server.spring;

import static io.nflow.engine.config.Profiles.H2;
import static java.lang.Boolean.FALSE;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.slf4j.LoggerFactory.getLogger;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.support.ResourcePropertySource;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class NflowStandardEnvironment extends StandardEnvironment {
  @SuppressWarnings("hiding")
  private static final Logger logger = getLogger(NflowStandardEnvironment.class);

  @SuppressFBWarnings(value = "MC_OVERRIDABLE_METHOD_CALL_IN_CONSTRUCTOR",
      justification = "addExternalPropertyResource and setupDbProfile are private")
  @SuppressWarnings("this-escape")
  public NflowStandardEnvironment(Map<String, Object> overrideProperties) {
    getPropertySources().addFirst(new MapPropertySource("override", overrideProperties));
    addExternalPropertyResource();
    String env = getProperty("env", "local");
    addPropertyResource(env);
    addPropertyResource("common");
    addPropertyResource("nflow-server");
    var clearProfiles = getProperty("clearProfiles", Boolean.class, FALSE);
    if (clearProfiles) {
      setActiveProfiles("ignore-environment-profiles");
    }
    addActiveProfile(env);
    String profiles = getProperty("profiles", String.class, "");
    for (String profile : profiles.split(",")) {
      if (!profile.trim().isEmpty()) {
        addActiveProfile(profile);
      }
    }
    setupDbProfile();
  }

  private void setupDbProfile() {
    boolean dbProfileDefined = false;
    String[] activeProfiles = getActiveProfiles();
    for (String profile : activeProfiles) {
      if (profile.startsWith("nflow.db")) {
        if (dbProfileDefined) {
          throw new RuntimeException("Multiple nflow.db profiles defined: " + Arrays.toString(activeProfiles));
        }
        dbProfileDefined = true;
      }
    }
    if (!dbProfileDefined) {
      addActiveProfile(H2);
    }
  }

  private void addExternalPropertyResource() {
    String externalLocation = getProperty("nflow.external.config");
    if (!isEmpty(externalLocation)) {
      try {
        getPropertySources().addLast(new ResourcePropertySource(externalLocation));
        logger.info("Using external configuration file: {}", externalLocation);
      } catch (IOException e) {
        throw new RuntimeException("Failed to initialize external properties from location " + externalLocation, e);
      }
    }
  }

  private void addPropertyResource(String name) {
    name += ".properties";
    try {
      getPropertySources().addLast(new ResourcePropertySource(name, getClass().getClassLoader()));
    } catch (@SuppressWarnings("unused") IOException e) {
      logger.info("Failed to initialize environment-specific properties from resource {}", name);
    }
  }
}
