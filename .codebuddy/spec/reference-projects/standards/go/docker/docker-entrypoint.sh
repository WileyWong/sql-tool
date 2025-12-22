#!/bin/sh
if [ -n "$PLUGIN_DIR" ]; then
    cd "$PLUGIN_DIR" || exit 1
fi

printf "%s" "$PLUGIN_EXTRA_ARGS" | xargs custom-gcl run -c /.golangci.yml --timeout=15m0s --print-resources-usage
