/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package BinPacking;

import java.util.Scanner;

/**
 *
 * @author maverick
 */

public class BinPacking 
{
    public static void BinPacking(double []a, double size, int n)
    {
        int binCount = 1;
        double s = size;
        for(int i=0; i<n; i++)
        {
            if(s - a[i] > 0)
            {
                s -= a[i];   
               // continue;              
            }
            else
            {
                binCount++;
                s = size;
                i--;
            }           
        }/*
        */
          System.out.println("Number of bins required: "+binCount);
//        System.out.println("")
    }

    public static void main(String args[])
    {
        System.out.println("BIN - PACKING Algorithm");
        System.out.println("Enter the number of items in Set: ");
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println("Enter "+n+" items:");
        double []a = new double[n];
        for(int i=0; i<n; i++)
            a[i] = sc.nextDouble();
        System.out.println("Enter the bin size: ");
        double size = sc.nextDouble();
        BinPacking(a, size, n);
       // System.out.println(binPacking(a,); 
        sc.close();
    }
}