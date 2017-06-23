#!/bin/bash

set -ex

VERSION="$1"
INSTALL_DIR="/opt/yarn"
sudo mkdir -p "${INSTALL_DIR}"
sudo chown ubuntu "${INSTALL_DIR}"
cd "${INSTALL_DIR}"
wget https://registry.npmjs.org/yarn/-/yarn-${VERSION}.tgz --no-check-certificate
tar zxf yarn-${VERSION}.tar.gz
sudo ln -s "${INSTALL_DIR}/dist/bin/yarn" /usr/local/bin/yarn
sudo ln -s "${INSTALL_DIR}/dist/bin/yarn.js" /usr/local/bin/yarn.js
sudo ln -s "${INSTALL_DIR}/dist/bin/yarnpkg" /usr/local/bin/yarnpkg
