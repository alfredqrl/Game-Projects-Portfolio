using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshModify_Sphere : MeshModify
{  
    public Sphere[] sphere;
  
    public void Startup()
    {
    }

    public override Vector3[] ModifyEffect(Vector3[] vectors, Transform m_transform)
    {   
        Vector3[] temp = new Vector3[vectors.Length];
        for (int i=0; i<vectors.Length;i++)
        {
            temp[i] = vectors[i];
            
            for(int j=0; j<sphere.Length; j++)
          
            {
                if (Vector3.Distance(vectors[i], sphere[j].center) < sphere[j].radius)
                {
                    temp[i] = (vectors[i] - sphere[j].center).normalized * sphere[j].radius + sphere[j].center;
                }
            }

        }

        return temp;
    }



}

