using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshModify_Transform : MeshModify
{
    public Vector3 offset;
    public Vector3 rotation;
    public Vector3 scale = Vector3.one;
    void Start()
    {
        
    }

    // Update is called once per frame

    public override Vector3[] ModifyEffect(Vector3[] vectors, Transform m_transform)
    {
        Vector3[] temp = new Vector3[vectors.Length];
        for (int i = 0; i < vectors.Length; i++)
        {
            temp[i] = new Vector3(vectors[i].x * scale.x, vectors[i].y * scale.y, vectors[i].z * scale.z) + offset;
          
        }
        temp = RotationVector(temp, rotation);
        return temp;
    }


}

