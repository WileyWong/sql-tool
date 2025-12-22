#!/bin/sh
# level
if [ -z "$PLUGIN_LEVEL" ]; then
  PLUGIN_LEVEL=warning
fi
if [ "$PLUGIN_LEVEL" != warning ] && [ "$PLUGIN_LEVEL" != error ] && [ "$PLUGIN_LEVEL" != info ]; then
  echo "unsupported level $PLUGIN_LEVEL"
  exit 1
fi

# format && output
if [ -z "$PLUGIN_FORMAT" ]; then
  PLUGIN_FORMAT=xml
fi
if [ "$PLUGIN_FORMAT" = "xml" ]; then
  if [ -z "$PLUGIN_OUTPUT" ]; then
    PLUGIN_OUTPUT=report.xml
  fi
elif [ "$PLUGIN_FORMAT" = "plain" ]; then
  if [ -z "$PLUGIN_OUTPUT" ]; then
    PLUGIN_OUTPUT=report.txt
  fi
else
  echo "unsupported format $PLUGIN_FORMAT"
  exit 1
fi

# epc
if [ -z "$PLUGIN_EPC" ]; then
  PLUGIN_EPC=false
fi
if [ "$PLUGIN_EPC" = "true" ]; then
  CONFIG=/app/epc_tencent_checks.xml
else
  CONFIG=/app/tencent_checks.xml
fi

# filelist
if [ -n "$PLUGIN_FILELIST" ]; then
  cat <"$PLUGIN_FILELIST" | xargs java -jar "$JAR" -c "$CONFIG" -o "$PLUGIN_OUTPUT" -f "$PLUGIN_FORMAT"
else
  java -jar "$JAR" -c "$CONFIG" -o "$PLUGIN_OUTPUT" -f "$PLUGIN_FORMAT" "./$PLUGIN_DIR"
fi

# error check
if [ "$PLUGIN_FORMAT" = "xml" ]; then
  case "$PLUGIN_LEVEL" in
  error) MATCHER='severity="error"' ;;
  warning) MATCHER='severity="(error|warning)"' ;;
  info) MATCHER='severity="(error|warning|info)"' ;;
  esac
elif [ "$PLUGIN_FORMAT" = "plain" ]; then
  case "$PLUGIN_LEVEL" in
  error) MATCHER='\[ERROR]' ;;
  warning) MATCHER='\[(ERROR|WARN)]' ;;
  info) MATCHER='\[(ERROR|WARN|INFO)]' ;;
  esac
fi
if grep -P "$MATCHER" "$PLUGIN_OUTPUT"; then
  cat "$PLUGIN_OUTPUT"
  echo "report file:$PLUGIN_OUTPUT"
  exit 1
fi

exit 0
