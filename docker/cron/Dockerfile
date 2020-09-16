FROM ubuntu:latest

# install cron
RUN apt-get update
RUN apt-get -y install cron curl

WORKDIR /money-dashboard

# install our own cronfile
COPY crontab *.sh ./
RUN chmod +x ./*.sh
RUN crontab ./crontab

# create the log file to be able to run tail
RUN touch /var/log/cron.log

CMD cron && echo "cron started @ $(date)" && : >> /var/log/cron.log && tail -F /var/log/cron.log
