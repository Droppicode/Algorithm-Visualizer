#include <iostream>
#include <queue>
#include <vector>
#include <fstream>
#include "json.hpp" // Include a JSON library like nlohmann/json

using namespace std;
using json = nlohmann::json;

// BFS from given source s
void bfs(vector<vector<int>>& adj, int s) {
    queue<int> q;
    vector<bool> visited(adj.size(), false);
    visited[s] = true;
    q.push(s);

    ofstream file("bfs.json");
    if(!file.is_open()) {
        cerr << "Failed to open file" << endl;
    }

    while (!q.empty()) {
        int curr = q.front();

        // Output the current state as JSON
        vector<int> q_vec;
        queue<int> q_copy = q;
        while (!q_copy.empty()) {
            q_vec.push_back(q_copy.front());
            q_copy.pop();
        }

        string log = "";
        if(curr == 0) log += "BFS started from node 0\n"; 
        log += "Current node: " + to_string(curr);

        json state = {
            {"current", curr},
            {"queue", q_vec},
            {"visited", visited},
            {"log", log}
        };

        q.pop();

        file << state.dump() << endl;

        for (int x : adj[curr]) {
            if (!visited[x]) {
                visited[x] = true;
                q.push(x);
            }
        }
    }

    file.close();
}

void addEdge(vector<vector<int>>& adj, int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u); // Undirected Graph
}

int main() {
    int V = 5;
    vector<vector<int>> adj(V);
    addEdge(adj, 0, 1);
    addEdge(adj, 0, 2);
    addEdge(adj, 1, 3);
    addEdge(adj, 1, 4);
    addEdge(adj, 2, 4);

    bfs(adj, 0);

    return 0;
}