#!/bin/bash

export path="$url"

git clone "$url" /home/app/output

exec node script.js