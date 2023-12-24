using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshModify : MonoBehaviour
{
    public virtual Vector3[] ModifyEffect(Vector3[] vectors, Transform m_transform)
    {
        
        return vectors;
    }

  
    public float GetTonMeshSize(MeshSize meshSize, Vector3 v, Axis axis)
    {
        float t = 0;
        switch(axis)
        {
            case Axis.x:
                t = Mathf.InverseLerp(meshSize.min.x, meshSize.max.x, v.x);
                break;
            case Axis.y:
                t = Mathf.InverseLerp(meshSize.min.y, meshSize.max.y, v.y);
                break;
            case Axis.z:
                t = Mathf.InverseLerp(meshSize.min.z, meshSize.max.z, v.z);
                break;
        }
        return t;
    }

  
    public Vector3 RotationVector(Vector3 v, float angle, Axis axis)
    {
        if (angle % 360 == 0)
        {
            return v;
        }
        angle *= Mathf.Deg2Rad;
        //! ������Ļ���תΪ�Ƕȣ���ΪU3d�ĽǶȼ���ʹ���Ĭ�ϵļ��㷽ʽ��һ��

        Vector3 temp = new Vector3();
        switch (axis)
        {
            case Axis.x:
                temp.x = v.x;
                temp.y = v.z * Mathf.Sin(angle) + v.y * Mathf.Cos(angle);
                temp.z = v.z * Mathf.Cos(angle) - v.y * Mathf.Sin(angle);
                break;
            case Axis.y:
                temp.x = v.z * Mathf.Sin(angle) + v.x * Mathf.Cos(angle);
                temp.y = v.y;
                temp.z = v.z * Mathf.Cos(angle) - v.x * Mathf.Sin(angle);
                break;
            case Axis.z:
                temp.x = v.x * Mathf.Cos(angle) - v.y * Mathf.Sin(angle);
                temp.y = v.x * Mathf.Sin(angle) + v.y * Mathf.Cos(angle);
                temp.z = v.z;
                break;

        }
        return temp;
    }

    /// <summary>
    /// ����������תλ������
    /// </summary>
    /// <param name="vectors"></param>
    /// <param name="angle">��ת�Ƕ�</param>
    /// <param name="axis">ʹ����</param>
    /// <returns></returns>
    public Vector3[] RotationVector(Vector3[] vectors, float angle, Axis axis)//����������ת�Ƕ� ��������������
    {
        if (angle % 360 == 0)
        {
            return vectors;
        }

        Vector3[] temp = new Vector3[vectors.Length];
        for (int i = 0; i < vectors.Length; i++)
        {
            temp[i] = RotationVector(vectors[i], angle, axis);
        }
        return temp;
    }
    
    
    public Vector3[] RotationVector(Vector3[] vectors, Vector3 angle)
    {
        if (angle == Vector3.zero)
        {
            return vectors;
        }
        Vector3[] temp = vectors;
        temp = RotationVector(temp, angle.x, Axis.x);
        temp = RotationVector(temp, angle.y, Axis.y);
        temp = RotationVector(temp, angle.z, Axis.z);
        return temp;
    }
    
   
    public MeshSize GetMeshSize(Vector3[] vectors)
    {
        MeshSize meshSize = new MeshSize();
        meshSize.max = vectors[0];
        meshSize.min = vectors[0];
        foreach(Vector3 v in vectors)
        {
            if (meshSize.min.x > v.x) { meshSize.min.x = v.x; }
            if (meshSize.min.y > v.y) { meshSize.min.y = v.y; }
            if (meshSize.min.z > v.z) { meshSize.min.z = v.z; }
            if (meshSize.max.x < v.x) { meshSize.max.x = v.x; }
            if (meshSize.max.y < v.y) { meshSize.max.y = v.y; }
            if (meshSize.max.z < v.z) { meshSize.max.z = v.z; }
        }
        meshSize.length.x = meshSize.max.x - meshSize.min.x;
        meshSize.length.y = meshSize.max.y - meshSize.min.y;
        meshSize.length.z = meshSize.max.z - meshSize.min.z;
        return meshSize;
    }


}

public struct MeshSize 
{
    public Vector3 min, max, length;    

}

