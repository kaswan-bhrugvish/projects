/******************************************************************************
 *  readme.txt template                                                   
 *****************************************************************************/

Name: Arun Kumar Kaswan
Date: 04/17/2020
Hours to complete assignment (optional): 100+

/******************************************************************************
 *  Explain how to compile/run your program.
 *****************************************************************************/

// There are two packages for in zip file to address the Problem 
#default package to address if via dijkstra method.
this package contains following java file
1. DijkstraAlgorithm
2. Edge
3. Graph
4. Main
5. Vertex

package 2 is named as star,
// solving problem via astar menthod.

approach considered to solving the problems in more optimized way is mentioned below.

Note. 
Input.txt file has been named as t1 which was provided in the problem
USA.txt file has been named as t2 which was provided in the Draft and attachment to the problem


/******************************************************************************
 *  Explain how you improved the algorithm.
 *****************************************************************************/

// A * (star) Sorting
// Start both open and close list
enable an empty list of locations
allow an empty closed list of locations
// Enter the starting point
set StartNode to OpenList (leave zero)
// Loop until you get the end
while the open list is empty
// Get current mode
let the currentNode equal the node with a minimum value of f
remove the current Node from openList
add the current Node
// Found the goal
if the current Node is a policy
Congratulations! You found the end! Backtrack to find the way
// Get the kids started
let the parent of the current Node match with the surrounding locations

per child for parent
// The child is in Closed Line
if the child is on Closed Line
continue the start of the hanging
// Create values ​​of f, g, and h
child.g = Node.g + distance between child and current
child.h = distance from child to end
child.f = child.g + child.h
// The child is already in openList
if the child.position is in the openList's node positions
when a child.g. is greater than openList node's g
continue the start of the hanging
// Put the child in the open list
add the child to the open list





/******************************************************************************
 *  What is the order of growth of the amount of memory (in the worst
 *  case) of your program as a function of V and E?
 *
 *  Briefly justify your answer.
 *****************************************************************************/
// Response for Input.txt = t1

Number of vertices =  6
Number of edges    =  4

Amount of memory = 681696

output:
Taking Source Destination in....
0
1
2
5
Actual Memory Used 681696


// Response for USA.txt = t2


Amount of memory = 34137584

output :
Taking Source Destination in....
0
18
34
37
46
50
Actual Memory Used 34137584


/******************************************************************************
 *  What is the order of growth of the running time (in the worst case)
 *  of your program as a function of V and E?
 *
 *  Briefly justify your answer.
 *****************************************************************************/

We can see that fat is essentially the weight of one of the edges, so we sort all the edge weights
And do binary search. To test whether there is a way to have more fat than X,
We perform a width-first search that only runs edges that are less than or equal to x. But we
Reach out, there is such a way.
If there is such a way, at the bottom of the range that we are searching for, see if it is rigid
Fat bonding also applies. If there is no such path, we take it back to the top of the array
We are searching to ease that limitation. When we find two neighborhood values, one of them works
And one of them is missing, our answer is. This takes O ((V + E) lg E) time.
Another good solution is to modify Dijkstra's algorithm. We use "fat" instead of whole
Score paths require only marginal weights, and Dijkstra only modification
Relaxation operation so that it maximizes the current-fat of the destination node
The weight of the incoming edge (i, j) and the minimum-fat (source) of any path to i
Incoming edge).
The correct argument is almost the same as Dijkstra's algorithm. Right
The solution should note the negative-weight edges, which is the case here and in general
Break up Dijkstra, don't do that here; Adding negative numbers produces a more-negative path
Weights, but not taking their maximum. 


/******************************************************************************
 *  Known bugs / limitations / challenges.
 *****************************************************************************/





/******************************************************************************
 *  List any other comments here. Feel free to provide any feedback   
 *  on how much you learned from doing the assignment, and whether    
 *  you enjoyed doing it.                                             
 *****************************************************************************/
//
Thank you Dr. Yao
for considering and giving access time to complete the assignment 3.
initially when i was looking to the problem from you suggestion kept me in multiple thought to the approches can are to be considered.
apparently the relaxation gave me additional time to think on much possible ways to address even without priority queue.

this major problem faced during the assignment was to address the line breaks and extra spaces which were present in the .txt file
the exceptional error had take lots of time over completion of this Assignment.

By the end, had learned more knowledge how to address the input without looking at the input file formats. 
One of the major kick back that i had for the assignment was the blockage to how to address the undermined space and line breaks for the input file.

Thanks You Dr. Yao, Totally loved the Assignment.
