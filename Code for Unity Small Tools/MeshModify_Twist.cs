using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshModify_Twist : MeshModify
{
    public float angle;
    public Axis axis;
    public bool effectClamp;
    public bool flip;
    [Range(0,1f)]
    public float clampmin=0, clampmax=1;
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    public override Vector3[] ModifyEffect(Vector3[] vectors, Transform m_transform)
    {
        if (angle == 0) { return vectors; }
        Vector3[] temp = new Vector3[vectors.Length];
        MeshSize meshSize = GetMeshSize(vectors);
        float t, angletemp;
        for (int i = 0; i < vectors.Length; i++)
        {
            switch (axis)
            {
                case Axis.x:
                    t = Mathf.InverseLerp(meshSize.min.x, meshSize.max.x, vectors[i].x);
                    t = GetClamp(t);//����
                    angletemp = Mathf.Lerp(0, angle, t);
                    temp[i] = RotationVector(vectors[i], angletemp, Axis.x);
                    break;

                case Axis.y:
                    t = Mathf.InverseLerp(meshSize.min.y, meshSize.max.y, vectors[i].y);
                    t = GetClamp(t);
                    angletemp = Mathf.Lerp(0, angle, t);
                    temp[i] = RotationVector(vectors[i], angletemp, Axis.y);
                    break;

                case Axis.z:
                    t = Mathf.InverseLerp(meshSize.min.z, meshSize.max.z, vectors[i].z);
                    t = GetClamp(t);
                    angletemp = Mathf.Lerp(0, angle, t);
                    temp[i] = RotationVector(vectors[i], angletemp, Axis.z);
                    break;
            }

        }
        return temp;
    }

    float GetClamp(float t)
    {
        if (flip) { t = 1 - t; }
        if (effectClamp) { return t; }
        if (clampmax < clampmin) { clampmin = clampmax; }
        t = Mathf.Clamp(t, clampmin, clampmax);
        return t;
    }
}
