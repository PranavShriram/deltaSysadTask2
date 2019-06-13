Delta Sysad Task 2

 A load balancer built with nodejs and nginx which handles requests by allocating them to four different nodes depending on the availability 
 of system resources like number of CPUs and memory.
 
 Requirements:
 
 1.node and npm
 
 2.nginx
 
 3.mongodb listening on port 27017
 
 4.python
 
 Instructions
 
 1.Run the nginx confiiguration files nginxLoadBalancerConfig and nginx_config using the command "nginx -c <path_to_file>"
 
 2.Open the terminal inside the folder where the project is present and run "node mongoinitialise.js" which adds four entries to nodes collection in the serverSetup database of mongodb.
 
 3.Run the python file python_script.py which sends post requests to the load balancer at regular intervals
