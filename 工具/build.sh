mkdir -p ./dist/ 
process=(./plus/buildxg.sh ./plus/hybrid/index.sh)
for app in ${process[@]}; do
  echo $app
  sh ./${app} &
  PIDS+=($!)
done
echo $PID
# wait for all processes to finish, and store each process's exit code into array STATUS[].
for pid in ${PIDS[@]}; do
  echo "pid=${pid}"
  wait ${pid}
  STATUS+=($?)
done

# after all processed finish, check their exit codes in STATUS[].
i=0
buildState=0
for st in ${STATUS[@]}; do
  if [[ ${st} -ne 0 ]]; then
    echo "${process[i]} failed"
    buildState=1
  else
    echo "${process[i]} finish"
  fi
  ((i+=1))
done
if [[ ${buildState} -ne 0 ]]; then
  exit 1
fi

echo "buid finish `date "+%Y-%m-%d %H:%M:%S"`" 
