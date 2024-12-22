#!/usr/bin/bash

source .env

mkdir deploy_temp_dir
sed "/<title>/a $(grep 'script.*app' dist/gdelt.html | sed 's/assets/assets\/gdelt/')" $SITE_DIR/gdelt.html > deploy_temp_dir/gdelt.html

mkdir deploy_temp_dir/gdelt
cp dist/assets/* deploy_temp_dir/gdelt/
sed -i 's/assets/assets\/gdelt/g' deploy_temp_dir/gdelt/app-*.js
rm deploy_temp_dir/gdelt/gdelt-*.css

sudo mv deploy_temp_dir/gdelt.html $SITE_DIR/gdelt.html
sudo mv deploy_temp_dir/gdelt $SITE_DIR/assets/

rm -r deploy_temp_dir
