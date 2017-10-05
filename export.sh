#!/bin/bash

echo -n "Username: "
read user
echo -n "Password: "
read -s pass
echo

echo -n "Output format: (json/csv) "
read format

if [ "$format" == "json" ]
then
	mongoexport -u ${user} -p ${pass} --authenticationDatabase resolve --db resolve --collection data --type=json --out data.json
elif [ "$format" == "csv" ]
then
	fields="type,module,name,author,code,time,correct"
	mongoexport -u ${user} -p ${pass} --authenticationDatabase resolve --db resolve --collection data --type=csv --out data.csv --fields ${fields}
else
	echo "Format not supported."
fi


