#!/bin/bash
echo "Username: "
read user
echo -n "Password: "
echo
read -s pass

mongoexport -u ${user} -p ${pass} --authenticationDatabase resolve --db resolve --collection data --type=json --out data.json

