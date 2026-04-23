#!/bin/sh
# Downloads Node.js into ../.tools/node (no Homebrew required).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOOLS="$ROOT/.tools"
NODE_VER="${NODE_VER:-v22.14.0}"
ARCH="$(uname -m)"
case "$ARCH" in
  arm64) NODE_ARCH=darwin-arm64 ;;
  x86_64) NODE_ARCH=darwin-x64 ;;
  *) echo "Unsupported arch: $ARCH"; exit 1 ;;
esac
mkdir -p "$TOOLS"
if [ -x "$TOOLS/node/bin/node" ]; then
  _v="$("$TOOLS/node/bin/node" -v)"
  echo "Node already present: $_v"
  exit 0
fi
TAR="node-${NODE_VER}-${NODE_ARCH}.tar.gz"
curl -fsSL "https://nodejs.org/dist/${NODE_VER}/${TAR}" -o "$TOOLS/$TAR"
tar -xzf "$TOOLS/$TAR" -C "$TOOLS"
rm "$TOOLS/$TAR"
mv "$TOOLS/node-${NODE_VER}-${NODE_ARCH}" "$TOOLS/node"
_v="$("$TOOLS/node/bin/node" -v)"
echo "Installed $_v at $TOOLS/node/bin"
