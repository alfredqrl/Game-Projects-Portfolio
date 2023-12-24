using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshModify_Blend : MeshModify
{
    public float angle;
    public float direction;
    public Axis axis;
    public float bendradiu;
    public Vector3 bendcenter;
    private float angle_min, angle_max;

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    public override Vector3[] ModifyEffect(Vector3[] vectors, Transform m_transform)
    {
        if (angle == 0) { return vectors; }

        if (direction % 360 != 0) { vectors = RotationVector(vectors, direction, axis); }

        MeshSize meshSize = GetMeshSize(vectors);

        GetBendBaseData(meshSize, axis);

        Vector3[] temp = new Vector3[vectors.Length];

        float t, angletemp;
        for (int i = 0; i < vectors.Length; i++)
        {
            switch (axis)
            {
                case Axis.x:
                    t = Mathf.InverseLerp(meshSize.min.x, meshSize.max.x, vectors[i].x);
                    angletemp = Mathf.Lerp(angle_min, angle_max, t);

                    temp[i].x = Mathf.Sin(angletemp) * (bendradiu + vectors[i].y);
                    temp[i].y = Mathf.Cos(angletemp) * (bendradiu + vectors[i].y);
                    temp[i].z = vectors[i].z;
                    break;

                case Axis.y:
                    t = Mathf.InverseLerp(meshSize.min.y, meshSize.max.y, vectors[i].y);
                    angletemp = Mathf.Lerp(angle_min, angle_max, t);

                    temp[i].x = vectors[i].x;
                    temp[i].y = Mathf.Sin(angletemp) * (bendradiu + vectors[i].z);
                    temp[i].z = Mathf.Cos(angletemp) * (bendradiu + vectors[i].z);
                    break;

                case Axis.z:
                    t = Mathf.InverseLerp(meshSize.min.z, meshSize.max.z, vectors[i].z);
                    angletemp = Mathf.Lerp(angle_min, angle_max, t);

                    temp[i].x = Mathf.Cos(angletemp) * (bendradiu + vectors[i].x);
                    temp[i].y = vectors[i].y;
                    temp[i].z = Mathf.Sin(angletemp) * (bendradiu + vectors[i].x);
                    break;

            }
            temp[i] += bendcenter;


        }
        if (direction % 360 != 0) { temp = RotationVector(temp, -direction, axis); }
        return temp;
    }
    
    void GetBendBaseData(MeshSize meshSize, Axis axis)
    {
        float angle_half = angle * 0.5f;
        float angle_offset = 0f;
        switch (axis)
        {
            case Axis.x:
                bendradiu = (meshSize.length.x / (angle / 360)) / Mathf.PI / 2;
                bendcenter = Vector3.down * bendradiu;//Vector3.down��0��-1��0
                angle_offset = (meshSize.max.x - meshSize.length.x * 0.5f) / (meshSize.length.x * 0.5f) * angle_half;
                break;
            case Axis.y:
                bendradiu = (meshSize.length.y / (angle / 360)) / Mathf.PI / 2;
                bendcenter = Vector3.back * bendradiu;//Vector3.down��0��0��-1
                angle_offset = (meshSize.max.y - meshSize.length.y * 0.5f) / (meshSize.length.y * 0.5f) * angle_half;
                break;
            case Axis.z:
                bendradiu = (meshSize.length.z / (angle / 360)) / Mathf.PI / 2;
                bendcenter = Vector3.right * bendradiu;//Vector3.right: 1,,0,,0
                angle_offset = (meshSize.max.z - meshSize.length.z * 0.5f) / (meshSize.length.z * 0.5f) * angle_half;
                break;
        }

        angle_min = (angle_offset - angle_half) * Mathf.Deg2Rad;//Mathf.Deg2Rad�ȵ����Ȼ��㳣��
        angle_max = (angle_offset + angle_half) * Mathf.Deg2Rad;

    }
}
