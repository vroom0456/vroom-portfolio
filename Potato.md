CREATE TABLE Students (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50),
    marks INTEGER
);

INSERT INTO Students VALUES
(1,'Alice',92),
(2,'Bob',78),
(3,'Charlie',85);

SELECT * FROM Students;

SELECT name, marks
FROM Students
WHERE marks >= 80
ORDER BY marks DESC;

<!DOCTYPE html>
<html>
<head>
<style>
body{
font-family:Arial;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#222;
color:white;
flex-direction:column;
}
button{padding:10px 20px;}
</style>
</head>
<body>

<h2 id="quote"></h2>
<button onclick="generate()">New Quote</button>

<script>
const quotes=[
"Dream Big",
"Keep Learning",
"Never Give Up",
"Stay Curious",
"Build Something Amazing"
];

function generate(){
document.getElementById("quote").innerText=
quotes[Math.floor(Math.random()*quotes.length)];
}
generate();
</script>

</body>
</html><?php
$weight = 70;
$height = 1.75;

$bmi = $weight / ($height * $height);

echo "BMI: " . round($bmi,2);

if($bmi < 18.5)
    echo "\nUnderweight";
elseif($bmi < 25)
    echo "\nNormal";
else
    echo "\nOverweight";
?>fn main() {
    let mut a = 0;
    let mut b = 1;

    for _ in 0..15 {
        println!("{}", a);
        let next = a + b;
        a = b;
        b = next;
    }
}package main

import "fmt"

func main() {
	todos := []string{}

	for {
		var task string
		fmt.Print("Task (exit to quit): ")
		fmt.Scanln(&task)

		if task == "exit" {
			break
		}

		todos = append(todos, task)
	}

	fmt.Println("\nTodo List")
	for i, t := range todos {
		fmt.Println(i+1, "-", t)
	}
}#include <iostream>
using namespace std;

int main() {
    float marks;
    cin >> marks;

    if (marks >= 90) cout << "A";
    else if (marks >= 80) cout << "B";
    else if (marks >= 70) cout << "C";
    else if (marks >= 60) cout << "D";
    else cout << "Fail";

    return 0;
}
#include <stdio.h>

int main() {
    float a, b;
    char op;

    printf("Enter: ");
    scanf("%f %c %f", &a, &op, &b);

    switch(op){
        case '+': printf("%.2f\n", a+b); break;
        case '-': printf("%.2f\n", a-b); break;
        case '*': printf("%.2f\n", a*b); break;
        case '/': printf("%.2f\n", a/b); break;
        default: printf("Invalid");
    }

    return 0;
}function updateClock() {
    const now = new Date();
    console.clear();
    console.log(now.toLocaleTimeString());
}

setInterval(updateClock, 1000);
updateClock();import java.util.Scanner;

public class PrimeChecker {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number: ");
        int n = sc.nextInt();

        boolean prime = n > 1;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                prime = false;
                break;
            }
        }

        System.out.println(prime ? "Prime" : "Not Prime");
    }
}import random

number = random.randint(1, 100)

while True:
    guess = int(input("Guess (1-100): "))
    if guess < number:
        print("Too low!")
    elif guess > number:
        print("Too high!")
    else:
        print("🎉 Correct!")
        break
